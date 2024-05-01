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
	configDir, err := createConfigDirIfNoExist()
	if err != nil {
		return "", err
	}
	if filename == "" {
		return "", errors.New("filename cannot be empty")
	}
	settingsJson := path.Join(configDir, filename)
	return settingsJson, nil
}

func createConfigDirIfNoExist() (string, error) {
	userConfig, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appConfigPath := path.Join(userConfig, "Save Manager")
	dirExists, errDirExists := exists(appConfigPath)
	if errDirExists != nil {
		return "", errDirExists
	}
	if !dirExists {
		os.Mkdir(appConfigPath, os.ModePerm)
	}
	return appConfigPath, nil
}

type StartAble interface {
	Startup(ctx context.Context)
}

func StartApps(ctx context.Context, l []StartAble) {
	for _, app := range l {
		app.Startup(ctx)
	}
}
