package utils

import (
	"context"
	"encoding/json"
	"errors"
	"io/fs"
	"os"
	"path"
)

func ReadConfigFrom[T any](filename string) (*T, error) {
	var defalutData T
	path, err := getConfigJson(filename)
	if err != nil {
		return &defalutData, err
	}
	jsonByte, errJsonByte := os.ReadFile(path)
	if errJsonByte != nil {
		return &defalutData, errJsonByte
	}
	var data T
	errData := json.Unmarshal(jsonByte, &data)
	if errData != nil {
		return &defalutData, errData
	}
	return &data, nil
}

func CreateConfigJsonIfNoExists[T any](filename string) (string, error) {
	settingsJson, errSettingsJson := getConfigJson(filename)
	if errSettingsJson != nil {
		return "", errSettingsJson
	}
	jsonExists, errJsonExists := exists(settingsJson)
	if errJsonExists != nil {
		return "", errJsonExists
	}
	if !jsonExists {
		var data T
		WriteStructTo(filename, &data)
	}
	return settingsJson, nil
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
	dirExists, errDirExists := exists(savesDir)
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

func WriteStructTo[T any](filename string, jsonStruct T) error {
	path, err := getConfigJson(filename)
	if err != nil {
		return err
	}
	jsonByte, errJsonByte := json.Marshal(jsonStruct)
	if errJsonByte != nil {
		return errJsonByte
	}
	return os.WriteFile(path, jsonByte, 0644)
}

func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, fs.ErrNotExist) {
		return false, nil
	}
	return false, err
}

func getConfigJson(filename string) (string, error) {
	err := createConfigDirIfNoExist()
	if err != nil {
		return "", err
	}
	if filename == "" {
		return "", errors.New("filename cannot be empty")
	}
	configDir, err := GetAppConfigDir()
	if err != nil {
		return "", err
	}
	settingsJson := path.Join(configDir, filename)
	return settingsJson, nil
}

func createConfigDirIfNoExist() error {
	appConfigPath, err := GetAppConfigDir()
	if err != nil {
		return err
	}
	dirExists, errDirExists := exists(appConfigPath)
	if errDirExists != nil {
		return errDirExists
	}
	if !dirExists {
		os.Mkdir(appConfigPath, os.ModePerm)
	}
	return nil
}

func GetAppConfigDir() (string, error) {
	userConfig, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appConfigPath := path.Join(userConfig, "Save Manager")
	return appConfigPath, nil
}

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
