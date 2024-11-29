package utils

import (
	"context"
	"path/filepath"

	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

func BrowsePath(ctx context.Context, path string) error {
	pathIsFile, err := isPathFile(path)
	if err != nil {
		return err
	}
	if pathIsFile {
		path = filepath.Dir(path)
	}
	rt.BrowserOpenURL(ctx, path)
	return nil
}
