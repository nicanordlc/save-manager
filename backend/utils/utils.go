package utils

import (
	"context"
	"errors"
	"io/fs"
	"os"
	"path"
	"path/filepath"

	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type StartAble interface {
	Startup(ctx context.Context)
}

func StartApps(l []StartAble) func(ctx context.Context) {
	return func(ctx context.Context) {
		for _, app := range l {
			app.Startup(ctx)
		}
	}
}

func CreateSavesDirIfNoExists() (string, error) {
	err := createConfigDirIfNoExist()
	if err != nil {
		return "", err
	}
	savesDir, err := GetSavesDir()
	if err != nil {
		return "", err
	}
	dirExists, errDirExists := Exists(savesDir)
	if errDirExists != nil {
		return "", errDirExists
	}
	if !dirExists {
		os.Mkdir(savesDir, os.ModePerm)
	}
	return savesDir, nil
}

func GetSavesDir() (string, error) {
	appConfig, err := GetAppConfigDir()
	if err != nil {
		return "", err
	}
	savesDir := path.Join(appConfig, "saves")
	return savesDir, nil
}

func CreateSaveDir(saveDir string) error {
	saveDir, err := GetSaveDir(saveDir)
	if err != nil {
		return err
	}
	os.Mkdir(saveDir, os.ModePerm)
	return nil
}

func GetSaveDir(saveDir string) (string, error) {
	savesDir, err := GetSavesDir()
	if err != nil {
		return "", err
	}
	newSaveDir := path.Join(savesDir, saveDir)
	return newSaveDir, nil
}

func Exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, fs.ErrNotExist) {
		return false, nil
	}
	return false, err
}

func GetAppConfigDir() (string, error) {
	userConfig, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appConfigPath := path.Join(userConfig, "Save Manager")
	return appConfigPath, nil
}

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

func createConfigDirIfNoExist() error {
	appConfigPath, err := GetAppConfigDir()
	if err != nil {
		return err
	}
	dirExists, errDirExists := Exists(appConfigPath)
	if errDirExists != nil {
		return errDirExists
	}
	if !dirExists {
		os.Mkdir(appConfigPath, os.ModePerm)
	}
	return nil
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

func isPathFile(path string) (bool, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return false, err
	}
	if fileInfo.IsDir() {
		return false, nil
	}
	return true, nil
}
