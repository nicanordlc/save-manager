package backend

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path"

	"github.com/cabaalexander/save-manager/backend/models"
	"github.com/cabaalexander/save-manager/backend/utils"
	"github.com/google/uuid"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type GameSingle struct {
	ID             uuid.UUID
	Name           string
	SavePath       string
	SavePathIsFile bool
}

type JsonGame struct {
	Data []GameSingle
}

type Game struct {
	ctx      context.Context
	Settings *Settings
	models.Json[JsonGame]
}

func (g *Game) Startup(ctx context.Context) {
	g.ctx = ctx
	g.Filename = "game.json"
	g.CreateConfigJsonIfNoExists()

	game, err := g.ReadData()
	if err != nil {
		panic(err)
	}
	g.JsonData = *game
}

func (g *Game) AddGame(name, savePath string, isFile bool) uuid.UUID {
	id := uuid.New()
	game := GameSingle{ID: id, Name: name, SavePath: savePath, SavePathIsFile: isFile}
	g.JsonData.Data = append(g.JsonData.Data, game)
	g.UpdateJson()
	CreateGameDir(id)
	g.logf("Created: %v", id)
	return id
}

func (g *Game) RemoveGame(id uuid.UUID) error {
	newList := []GameSingle{}
	for _, game := range g.JsonData.Data {
		if game.ID == id {
			continue
		}
		newList = append(newList, game)
	}
	if len(newList) == len(g.JsonData.Data) {
		errorMsg := fmt.Sprintf("no element deleted: %v", id)
		return errors.New(errorMsg)
	}
	g.JsonData.Data = newList
	g.UpdateJson()
	g.removeGameDir(id)
	g.logf("Deleted: %v", id)
	return nil
}

func (g *Game) FindGame(id uuid.UUID) GameSingle {
	for _, game := range g.JsonData.Data {
		if game.ID != id {
			continue
		}
		return game
	}
	return GameSingle{}
}

func (g *Game) BrowseGameDir(gameID uuid.UUID) {
	for _, game := range g.JsonData.Data {
		if game.ID == gameID {
			utils.BrowsePath(g.ctx, game.SavePath)
		}
	}
}

func (g *Game) UpdateGame(props GameSingle) {
	var gameList []GameSingle
	for _, gm := range g.JsonData.Data {
		if gm.ID == props.ID {
			if props.Name != "" {
				gm.Name = props.Name
			}
			if props.SavePath != "" {
				gm.SavePath = props.SavePath
			}
			gm.SavePathIsFile = props.SavePathIsFile
		}
		gameList = append(gameList, gm)
	}
	g.JsonData.Data = gameList
	g.UpdateJson()
}

func (g *Game) OpenDialogDirGame(gameID uuid.UUID) (string, error) {
	game := g.FindGame(gameID)
	return utils.OpenDialogDir(g.ctx, game.SavePath, game.SavePathIsFile)
}

func (g *Game) OpenDialogFileGame(gameID uuid.UUID) (string, error) {
	game := g.FindGame(gameID)
	return utils.OpenDialogFile(g.ctx, game.SavePath, game.SavePathIsFile)
}

func (g *Game) removeGameDir(gameID uuid.UUID) error {
	gameDir, err := GetGameDir(gameID)
	if err != nil {
		return err
	}
	os.RemoveAll(gameDir)
	return nil
}

func (g *Game) logf(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	rt.LogDebugf(g.ctx, "[Game] %v", msg)
}

func CreateGameDir(gameID uuid.UUID) error {
	gameDir, err := GetGameDir(gameID)
	if err != nil {
		return err
	}
	os.Mkdir(gameDir, os.ModePerm)
	return nil
}

func GetGameDir(gameID uuid.UUID) (string, error) {
	savesDir, err := utils.GetSavesDir("")
	if err != nil {
		return "", err
	}
	gameLabel := fmt.Sprintf("game-%v", gameID)
	gameDir := path.Join(savesDir, gameLabel)
	return gameDir, nil
}

func NewGame() *Game {
	return &Game{}
}
