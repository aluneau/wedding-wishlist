package main

import (
	"fmt"
	"log"
	"strconv"
	"wedding-backend/sheet"

	"encoding/json"
	"github.com/google/uuid"
)

func syncItemsFromSheet() {
	client, err := sheet.NewSheetClient("./credentials.json")
	spreadSheetId := "1TlWqaivkUd2rOfDGcwTSpqXP5-yCstxH9Ts1qv_k30o"
	values, err := client.Read(spreadSheetId, "Wishlist!A1:E400")
	if err != nil {
		log.Fatalf("Unable to retrieve wishlist data: %v", err)
	}
	for i := 1; i < len(values); i++ {
		row := values[i]
		if len(row) == 0 {
			fmt.Printf("Stopping at empty row line %d\n", i+1)
			break
		}
		if row[0] == "" {
			id := uuid.New()

			writeRange := "Wishlist!A" + strconv.Itoa(i+1)
			valueRange := [][]interface{}{{id.String}}

			err = client.Write(spreadSheetId, writeRange, valueRange)
			var newItem RegistryItem
			newItem.ID = id
			newItem.Name = row[1].(string)
			newItem.Description = row[2].(string)
			newItem.AmazonURL = row[3].(string)
			newItem.ImageURL = row[4].(string)
			key := "item:" + newItem.ID.String()
			data, _ := json.Marshal(newItem)
			rdb.Set(ctx, key, data, 0)
			fmt.Println("item added to Redis")
		} else {
			fmt.Println(row[0].(string))
			key := "item:" + row[0].(string)
			fmt.Println("item already existing")
			var existingItem RegistryItem
			val, _ := rdb.Get(ctx, key).Result()
			json.Unmarshal([]byte(val), &existingItem)
			id, _ := uuid.Parse(row[0].(string))
			existingItem.ID = id
			existingItem.Name = row[1].(string)
			existingItem.Description = row[2].(string)
			existingItem.AmazonURL = row[3].(string)
			existingItem.ImageURL = row[4].(string)
			data, _ := json.Marshal(existingItem)
			rdb.Set(ctx, key, data, 0)
		}
	}
}

func ReadUsersFromSheet() []Guest {
	client, err := sheet.NewSheetClient("./credentials.json")
	if err != nil {
		log.Fatalf("Error creating Sheets clietn: %v", err)
	}
	spreadSheetId := "1TlWqaivkUd2rOfDGcwTSpqXP5-yCstxH9Ts1qv_k30o"
	values, err := client.Read(spreadSheetId, "Feuille 1!A1:J500")
	if err != nil {
		log.Fatalf("Unable to retrieve data: %v", err)
	}

	var guests []Guest

	for i := 1; i < len(values); i++ {
		row := values[i]
		if len(row) == 0 {
			fmt.Printf("Stopping at empty row line %d\n", i+1)
			break
		}
		if len(row) < 10 {
			shortLink, _ := generateShortLink()
			writeRange := "Feuille 1!J" + strconv.Itoa(i+1)
			valueRange := [][]interface{}{{shortLink}}

			err = client.Write(spreadSheetId, writeRange, valueRange)
			if err != nil {
				log.Fatalf("Unable to write data: %v", err)
			}
			row = append(row, shortLink)
		}
		guest := Guest{
			Name:      row[0].(string),
			ShortLink: row[9].(string),
		}
		guests = append(guests, guest)

	}
	return guests
}
