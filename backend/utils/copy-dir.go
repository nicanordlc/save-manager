package utils

import (
	"os"

	cp "github.com/otiai10/copy"
)

func CopyDir(src, dst string) error {
	// hard copy (remove target dir and then copy)
	if err := os.RemoveAll(dst); err != nil {
		return err
	}
	return cp.Copy(src, dst)
}
