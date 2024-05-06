package utils

import (
	cp "github.com/otiai10/copy"
)

func CopyDir(src, dst string) error {
	return cp.Copy(src, dst)
}
