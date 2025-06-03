package main

import (
	"github.com/google/uuid"
)

type Guest struct {
	Name      string `json:"name"`
	ShortLink string `json:"shortLink"`
}

type Guests struct {
	Users []Guest `json:"users"`
}

type RegistryItem struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	ImageURL    string    `json:"imageUrl"`
	AmazonURL   string    `json:"amazonUrl"`
	Reserved    bool      `json:"reserved"`
	ReservedBy  string    `json:"reservedBy"`
}
