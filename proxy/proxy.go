package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type JsonResponse struct {
	Message string
}

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

	var data JsonResponse

	client := &http.Client{}
	var resp *http.Response
	var err error
	var req *http.Request
	var token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NTgwODU2MTQsInVzZXJuYW1lIjoiaW9uZG9kb24iLCJleHAiOjE1NTgwODkyMTR9.e91tJdTM9MKx77YR4l0tRQQubBPOFM7x6ENxq3_FyiSerp8a6EahMEP1X-vHQSJDB-OQti1ObplTaXlYz-6gYkcv46OdXXA0oi5AQeQxW9B2RkLsPJyYtu8v-YMQ4clHZQC6P7rFkHB_gbHm9X04ZjSKZJrxMtfx7vBhd8bJeJaieLEFYj_pzP5OxWXOM-AWMkSSXVqwf6gfQsVWqhPBLsbl2wmhLfNdoZxN82UhbO4s9GQeBIq-ltRfcixWhuW92pmGbBVh2G_OBKag-G05DYDprvOzMJj3JE63FbUBUOXu_2vXC1RHD7ybQKad0srWVEGgfnP2UpxRZHLkZy3EZWiwJtkaR8iMl8jCV7Gd6De7ykN2rQQdKpdGzTF8dWyyYM5q5xgwa1i8I5glITD_mI2URaBi7ACpdKvOYxnrw8CaDK6A1exEUbDUvDkVWl0MZBpT-XuYfA9SHFmaCvlqD3nPStysMcqwubfgNZ9puUv2lr_KLHor95FBe0H2TppHrwi02vX4TBFtMSPBIwKXN6JGkqjVX6YyofoS0d0dgSuNqKA2lChFtbS0gjN68X1jKoYSw-0zxlhWUgIIbwflYPfT_D5wkIfr13Z64582t-YXj_SKo78TL97pv0DI4CrhoCdQsO1z9S8cwCfbWRstTej-kQGmIn3b2RUH3S9JZxs"

	req, err = http.NewRequest(r.Method, "http://nginx:9000" + r.RequestURI, r.Body)
	for name, value := range r.Header {
		req.Header.Set(name, value[0])
	}

	req.Header.Set("Content_type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", token)

	resp, err = client.Do(req)
	r.Body.Close()

	//response, err := http.Post("http://nginx:9000/api", "application/x-www-form-urlencoded", r.Body)

	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	// read the payload, in this case, Jhon's info
	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		panic(err)
	}

	// this is where the magic happens, I pass a pointer of type JsonResponse and Go'll do the rest
	err = json.Unmarshal(body, &data)

	js, err := json.Marshal(data)
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