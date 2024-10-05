package utils

import "os"

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
