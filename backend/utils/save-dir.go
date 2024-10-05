package utils

import (
	"os"
	"path"
)

func CreateSaveDir(saveDir string) error {
	saveDir, err := GetSaveDir(saveDir)
	if err != nil {
		return err
	}
	os.Mkdir(saveDir, os.ModePerm)
	return nil
}

func GetSavesDir() (string, error) {
	appConfig, err := GetAppConfigDir()
	if err != nil {
		return "", err
	}
	savesDir := path.Join(appConfig, "saves")
	return savesDir, nil
}

func GetSaveDir(saveDir string) (string, error) {
	savesDir, err := GetSavesDir()
	if err != nil {
		return "", err
	}
	newSaveDir := path.Join(savesDir, saveDir)
	return newSaveDir, nil
}
