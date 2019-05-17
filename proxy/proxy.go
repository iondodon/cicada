package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

var parsed map[string]interface{}

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

func home(w http.ResponseWriter, r *http.Request) {
	client := &http.Client{}
	var resp *http.Response
	var err error
	var req *http.Request
	var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NTgxMDU3MzYsInVzZXJuYW1lIjoiaW9uZG9kb24iLCJleHAiOjE1NTgxMDkzMzZ9.YgSe1gfCyDIvRI4i09_Dsew1TGTgxjonsVqUor4HFK4DAliQ9UnRuF5zLQgn46GvuVI5neQ5AS_eh2dB1vQkbYNoFjJUJpEKpjTTqJn9pfW0LyACQykCQq6ru70Z2SLka26EdjaAO4P1PdanOMmPxzsiui0aDt3FfKhf5fvgq-X3yVn3N77tTDAo0A0MZpVsdCDQXNNMISNQ1Q70sSTt1uCF1SOw2yRU4KLA7pPLFEPw4lc-M9YqDVZkCj1CNaa2-n9nD7Yi-W-m8f8ElayPo2BYymhOAySF79eoXY-vZiPC_2MjgiGAYQTGlyPZbv5WKPUI8_p8Z195N4kvVGcQ9sqJFe_Z7rxHkEZVqe0V9qbYOHQkSIZdceoQhfxgUbHf0DSb2ccJzmKbibOJ6bzKpDtO5YAD_QJRrUsQDJTgInndaaMCeJfGwMpi_L2_vjoSxiX6l22khQTjP2iigBVyRr2X2AXAJL3Eel0noElfOSTbota8zJyJe2CdRG25oVC96aSXjbIx2X-OMdNF6KkLISUeWeO5x4szlNqWcdcXse92vRhEKxvamnsrHgi4r3AvOJS8eVyhD9CmQnDSX-GgI2HkNvxwqX9oqB8xCzGp4EtwJshdLbHffvcGgX6uhw4-hM7ZB34HLCZB21hIWYyYRWZwhQnzzgbfcgCU6JBAyjU"

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

	err = json.Unmarshal(body, &parsed)

	js, err := json.Marshal(parsed)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func main() {
	mw := chainMiddleware(withLogging, withTracing)
	http.Handle("/", mw(home))
	log.Fatal(http.ListenAndServe(":8080", nil))
}