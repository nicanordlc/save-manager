package utils

import (
	"errors"
	"os"
	"path"
	"testing"
)

func TestGetAppConfigDir(t *testing.T) {
	userConfig, _ := os.UserConfigDir()
	expectedPath := path.Join(userConfig, "Save Manager")

	testTable := []struct {
		name       string
		configPath string
		got        string
		gotError   error
		mock       func()
		clean      func()
	}{
		{
			name:       "use default system user config path",
			configPath: "",
			got:        expectedPath,
			gotError:   nil,
		},
		{
			name:       "should fail if default user config path function errors",
			configPath: "",
			got:        "",
			gotError:   ErrUserConfigDir,
			mock: func() {
				osUserConfigDir = func() (string, error) {
					return "", ErrUserConfigDir
				}
			},
			clean: func() {
				osUserConfigDir = os.UserConfigDir
			},
		},
		{
			name:       "use path provided via parameter",
			configPath: "/my/path/m8",
			got:        "/my/path/m8",
			gotError:   nil,
		},
	}

	for _, v := range testTable {
		if v.mock != nil {
			v.mock()
		}

		if v.clean != nil {
			t.Cleanup(v.clean)
		}

		t.Run(v.name, func(t *testing.T) {
			c, err := GetAppConfigDir(v.configPath)

			if v.gotError != nil {
				if !errors.Is(err, v.gotError) {
					t.Fatalf(
						"expected an error: %v, but got: %v",
						v.gotError,
						err,
					)
				}

				return
			}

			if c != v.got {
				t.Fatalf("Expected %v got %v", v.got, c)
			}
		})
	}
}
