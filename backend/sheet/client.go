package sheet

import (
	"context"
	"fmt"

	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"
)

type SheetClient struct {
	Service *sheets.Service
}

func NewSheetClient(credentialsPath string) (*SheetClient, error) {
	ctx := context.Background()

	srv, err := sheets.NewService(ctx, option.WithCredentialsFile(credentialsPath))
	if err != nil {
		return nil, fmt.Errorf("unable to create Sheets service: %v", err)
	}

	return &SheetClient{Service: srv}, nil
}
