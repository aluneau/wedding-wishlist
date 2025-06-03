package sheet

import (
	"fmt"
	"google.golang.org/api/sheets/v4"
)

func (sc *SheetClient) Read(spreadsheetID, readRange string) ([][]interface{}, error) {
	resp, err := sc.Service.Spreadsheets.Values.Get(spreadsheetID, readRange).Do()
	if err != nil {
		return nil, fmt.Errorf("read error: %v", err)
	}
	return resp.Values, nil
}

func (sc *SheetClient) Write(spreadsheetID, writeRange string, values [][]interface{}) error {
	valueRange := &sheets.ValueRange{
		Values: values,
	}

	_, err := sc.Service.Spreadsheets.Values.Update(spreadsheetID, writeRange, valueRange).
		ValueInputOption("RAW").
		Do()
	if err != nil {
		return fmt.Errorf("write error: %v", err)
	}
	return nil
}
