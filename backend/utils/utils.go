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

var osUserConfigDir = os.UserConfigDir

var ErrUserConfigDir = errors.New("os.UserConfigDir errored")

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

func CreateSavesDirIfNoExists(defaultAppConfigPath string) (string, error) {
	err := createConfigDirIfNoExist(defaultAppConfigPath)
	if err != nil {
		return "", err
	}
	savesDir, err := GetSavesDir(defaultAppConfigPath)
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

func GetSavesDir(defaultAppConfigPath string) (string, error) {
	appConfig, err := GetAppConfigDir(defaultAppConfigPath)
	if err != nil {
		return "", err
	}
	savesDir := path.Join(appConfig, "saves")
	return savesDir, nil
}

func CreateSaveDir(saveDir, defaultAppConfigPath string) error {
	saveDir, err := GetSaveDir(saveDir, defaultAppConfigPath)
	if err != nil {
		return err
	}
	os.Mkdir(saveDir, os.ModePerm)
	return nil
}

func GetSaveDir(saveDir, defaultAppConfigPath string) (string, error) {
	savesDir, err := GetSavesDir(defaultAppConfigPath)
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

func GetAppConfigDir(defaultAppConfigPath string) (string, error) {
	if defaultAppConfigPath != "" {
		return defaultAppConfigPath, nil
	}
	userConfig, err := osUserConfigDir()
	if err != nil {
		return "", ErrUserConfigDir
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

func createConfigDirIfNoExist(defaultAppConfigPath string) error {
	appConfigPath, err := GetAppConfigDir(defaultAppConfigPath)
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
