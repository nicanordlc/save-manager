package backend

import (
	"encoding/json"
	"errors"
	"os"
	"path"

	"github.com/cabaalexander/save-manager/backend/utils"
)

type Json[T any] struct {
	Filename string
	JsonData T
}

func (j *Json[T]) CreateConfigJsonIfNoExists() (string, error) {
	settingsJson, errSettingsJson := j.getConfigJson(j.Filename)
	if errSettingsJson != nil {
		return "", errSettingsJson
	}
	jsonExists, errJsonExists := utils.Exists(settingsJson)
	if errJsonExists != nil {
		return "", errJsonExists
	}
	if !jsonExists {
		var data T
		j.writeStructTo(j.Filename, data)
	}
	return settingsJson, nil
}

func (j *Json[T]) ReadData() (*T, error) {
	settingsJson, err := j.readConfigFrom(j.Filename)
	if err != nil {
		return settingsJson, err
	}
	return settingsJson, nil
}

func (j *Json[T]) UpdateJson() error {
	return j.writeStructTo(j.Filename, j.JsonData)
}

func (j *Json[T]) getConfigJson(filename string) (string, error) {
	err := j.createConfigDirIfNoExist()
	if err != nil {
		return "", err
	}
	if filename == "" {
		return "", errors.New("filename cannot be empty")
	}
	configDir, err := utils.GetAppConfigDir()
	if err != nil {
		return "", err
	}
	settingsJson := path.Join(configDir, filename)
	return settingsJson, nil
}

func (j *Json[T]) createConfigDirIfNoExist() error {
	appConfigPath, err := utils.GetAppConfigDir()
	if err != nil {
		return err
	}
	dirExists, errDirExists := utils.Exists(appConfigPath)
	if errDirExists != nil {
		return errDirExists
	}
	if !dirExists {
		os.Mkdir(appConfigPath, os.ModePerm)
	}
	return nil
}

func (j *Json[T]) readConfigFrom(filename string) (*T, error) {
	var defalutData T
	path, err := j.getConfigJson(filename)
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

func (j *Json[T]) writeStructTo(filename string, jsonStruct T) error {
	path, err := j.getConfigJson(filename)
	if err != nil {
		return err
	}
	jsonByte, errJsonByte := json.Marshal(jsonStruct)
	if errJsonByte != nil {
		return errJsonByte
	}
	return os.WriteFile(path, jsonByte, 0644)
}
