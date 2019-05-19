package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

var token string


func init() {
	log.SetFlags(log.Lshortfile)
}

// middleware provides a convenient mechanism for filtering HTTP requests
// entering the application. It returns a new handler which performs various
// operations and finishes with calling the next HTTP handler.
type middleware func(http.HandlerFunc) http.HandlerFunc

// chainMiddleware provides syntactic sugar to create a new middleware
// which will be the result of chaining the ones received as parameters.
func chainMiddleware(mw ...middleware) middleware {
	return func(final http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			last := final
			for i := len(mw) - 1; i >= 0; i-- {
				last = mw[i](last)
			}
			last(w, r)
		}
	}
}

func withLogging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Logged connection from %s", r.RemoteAddr)
		next.ServeHTTP(w, r)
	}
}

func withTracing(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Tracing request for %s", r.RequestURI)
		next.ServeHTTP(w, r)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	log.Println("Index function called")

	client := &http.Client{}
	var resp *http.Response
	var err error
	var req *http.Request
	var generalParsed map[string]interface{}

	req, err = http.NewRequest(r.Method, "http://nginx:9000" + r.RequestURI, r.Body)
	for name, value := range r.Header {
		req.Header.Set(name, value[0])
	}
	req.Header.Set("Content_type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", "Bearer " + token)
	resp, err = client.Do(req)
	r.Body.Close()

	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(body, &generalParsed)

	js, err := json.Marshal(generalParsed)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
	log.Println()
}

func login(w http.ResponseWriter, r *http.Request) {
	log.Println("token function called")

	client := &http.Client{}
	var resp *http.Response
	var err error
	var req *http.Request
	var jsonToken struct { Token string }

	req, err = http.NewRequest(r.Method, "http://nginx:9000" + r.RequestURI, r.Body)
	for name, value := range r.Header {
		req.Header.Set(name, value[0])
	}
	resp, err = client.Do(req)
	r.Body.Close()

	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(body, &jsonToken)

	js, err := json.Marshal(jsonToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if jsonToken.Token != "" {
		token = jsonToken.Token
	}

	log.Println(token)

	w.Write(js)
	log.Println()
}


func logout(w http.ResponseWriter, r *http.Request) {
	log.Println("logout function called")
	token = ""
	log.Println()
}

func main() {
	mw := chainMiddleware(withLogging, withTracing)
	http.Handle("/api/token", mw(login))
	http.Handle("/api/logout", mw(logout))
	http.Handle("/", mw(index))
	log.Fatal(http.ListenAndServe(":8080", nil))
}