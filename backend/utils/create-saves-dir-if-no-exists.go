package utils

import "os"

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
