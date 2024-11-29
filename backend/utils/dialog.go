package utils

import (
	"context"
	"path/filepath"

	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

func OpenDialogFile(ctx context.Context, path string, isFile bool) (string, error) {
	path, err := rt.OpenFileDialog(ctx, getFileOrDirOptions(path, isFile))
	if err != nil {
		return "", err
	}
	return path, nil
}

func OpenDialogDir(ctx context.Context, path string, isFile bool) (string, error) {
	pathIsFile, err := isPathFile(path)
	if err != nil {
		return "", err
	}
	// if path is a file get parent dir (so this opens a directory efectively)
	if pathIsFile {
		path = filepath.Dir(path)
	}
	path, err = rt.OpenDirectoryDialog(
		ctx,
		getFileOrDirOptions(path, isFile),
	)
	if err != nil {
		return "", err
	}
	return path, nil
}

func getFileOrDirOptions(path string, isFile bool) rt.OpenDialogOptions {
	if isFile {
		return rt.OpenDialogOptions{
			DefaultFilename: path,
			Title:           "Select File",
		}
	}
	return rt.OpenDialogOptions{
		DefaultDirectory: path,
		Title:            "Select Directory",
	}
}
