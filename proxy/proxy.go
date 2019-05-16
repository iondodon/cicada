package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

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
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
		case "POST":
			resp, err := http.Post("http://nginx:9000/api", r.Header.Get("Content-type"), r.Body)

			if err != nil {
				log.Fatal("error")
			}
			defer r.Body.Close()


			fmt.Fprint(w, json.NewDecoder(resp.Body))
			fmt.Println("WAS POST")
		case "GET":
			resp, _ := http.Get("http://nginx:9000")

			fmt.Fprint(w, resp.Body)
			fmt.Println("WAS GET")
	}
}

func main() {
	mw := chainMiddleware(withLogging, withTracing)
	http.Handle("/", mw(home))
	log.Fatal(http.ListenAndServe(":8080", nil))
}