package utils

import (
	"os"
	"path"
)

func GetAppConfigDir() (string, error) {
	userConfig, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	appConfigPath := path.Join(userConfig, "Save Manager")
	return appConfigPath, nil
}
