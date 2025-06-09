package main

import (
	"context"
	"encoding/json"
	"math/rand"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
)

const adminPasskey = "supersecret123"

var guests []Guest

var ctx = context.Background()

var rdb = redis.NewClient(&redis.Options{
	Addr: os.Getenv("REDIS_ADDR"),
})

func isAuthorized(r *http.Request) bool {
	key := r.Header.Get("X-Admin-Key")
	return key == adminPasskey
}

func addItem(w http.ResponseWriter, r *http.Request) {
	if !isAuthorized(r) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var newItem RegistryItem
	if err := json.NewDecoder(r.Body).Decode(&newItem); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	newItem.ID = uuid.New()

	key := "item:" + newItem.ID.String()
	data, _ := json.Marshal(newItem)
	rdb.Set(ctx, key, data, 0)

	w.WriteHeader(http.StatusCreated)
}

func deleteItem(w http.ResponseWriter, r *http.Request) {
	if !isAuthorized(r) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]
	key := "item:" + id

	if err := rdb.Del(ctx, key).Err(); err != nil {
		http.Error(w, "Failed to delete item", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func getItems(w http.ResponseWriter, r *http.Request) {
	keys, _ := rdb.Keys(ctx, "item:*").Result()
	var items []RegistryItem

	for _, key := range keys {
		val, _ := rdb.Get(ctx, key).Result()
		var item RegistryItem
		json.Unmarshal([]byte(val), &item)
		items = append(items, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func getUserByShortLink(w http.ResponseWriter, r *http.Request) {
	var selectedGuest Guest
	vars := mux.Vars(r)
	shortLink := vars["shortLink"]
	for _, user := range guests {
		if user.ShortLink == shortLink {
			selectedGuest = user
			break
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(selectedGuest)
}

func modifyItemReservation(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ShortLink string `json:"shortLink"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.ShortLink == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	id := vars["id"]
	key := "item:" + id

	val, err := rdb.Get(ctx, key).Result()
	if err != nil {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}

	var item RegistryItem
	json.Unmarshal([]byte(val), &item)

	if item.Reserved {
		if item.ReservedBy != "" && item.ReservedBy != req.ShortLink {
			http.Error(w, "Item already reserved by someone else", http.StatusForbidden)
			return
		}
		item.Reserved = false
		item.ReservedBy = ""
	} else {
		item.Reserved = true
		item.ReservedBy = req.ShortLink
	}

	data, _ := json.Marshal(item)
	rdb.Set(ctx, key, data, 0)

	w.WriteHeader(http.StatusOK)
}

func encodeBase62(num int) string {
	const base62chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
	if num == 0 {
		return string(base62chars[0])
	}
	result := ""
	base := len(base62chars)
	for num > 0 {
		result = string(base62chars[num%base]) + result
		num = num / base
	}
	return result
}

func generateShortLink() (string, error) {
	n := rand.Intn(10000) + 10000

	short := encodeBase62(n)

	for i := 0; i < len(guests); {
		if guests[i].ShortLink == short {
			i = 0
			n = rand.Intn(10000) + 10000
			short = encodeBase62(n)
		} else {
			i++
		}
	}

	return short, nil
}

func main() {
	guests = ReadUsersFromSheet()

	syncItemsFromSheet()
	r := mux.NewRouter()
	r.HandleFunc("/api/items", getItems).Methods("GET")
	r.HandleFunc("/api/items", addItem).Methods("POST")
	r.HandleFunc("/api/items/reserve/{id}", modifyItemReservation).Methods("PUT")
	r.HandleFunc("/api/users/getByShortLink/{shortLink}", getUserByShortLink).Methods("GET")
	// CORS allowed origins
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "X-Admin-Key"}),
	)

	http.ListenAndServe(":8080", corsHandler(r))
}
