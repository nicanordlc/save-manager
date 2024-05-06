package backend

import (
	"context"
	"fmt"
	"os"
	"path"

	"github.com/cabaalexander/save-manager/backend/utils"
	"github.com/google/uuid"
	rt "github.com/wailsapp/wails/v2/pkg/runtime"
)

type GameSingle struct {
	ID       uuid.UUID
	Name     string
	SavePath string
}

type JsonGame struct {
	Data []GameSingle
}

type Game struct {
	ctx      context.Context
	filename string
	JsonGame
}

func (g *Game) Startup(ctx context.Context) {
	g.ctx = ctx
	g.filename = "game.json"
	utils.CreateConfigJsonIfNoExists[JsonGame](g.filename)

	game, err := g.ReadGames()
	if err != nil {
		panic(err)
	}
	g.JsonGame = *game
}

func (g *Game) AddGame(name string, savePath string) uuid.UUID {
	id := uuid.New()
	game := GameSingle{ID: id, Name: name, SavePath: savePath}
	g.JsonGame.Data = append(g.JsonGame.Data, game)
	g.updateJson()
	CreateGameDir(id)
	g.logf("Created: %v", id)
	return id
}

func (g *Game) RemoveGame(id uuid.UUID) {
	newList := []GameSingle{}
	for _, game := range g.JsonGame.Data {
		if game.ID == id {
			continue
		}
		newList = append(newList, game)
	}
	g.JsonGame.Data = newList
	g.updateJson()
	g.removeGameDir(id)
	g.logf("Deleted: %v", id)
}

func (g *Game) ReadGames() (*JsonGame, error) {
	gameJson, err := utils.ReadConfigFrom[JsonGame](g.filename)
	if err != nil {
		return gameJson, err
	}
	return gameJson, nil
}

func (g *Game) FindGame(id uuid.UUID) GameSingle {
	for _, game := range g.JsonGame.Data {
		if game.ID != id {
			continue
		}
		return game
	}
	return GameSingle{}
}

func (g *Game) OpenGameDir(gameID uuid.UUID) {
	for _, game := range g.JsonGame.Data {
		if game.ID == gameID {
			utils.OpenPath(g.ctx, game.SavePath)
		}
	}
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

func (g *Game) updateJson() error {
	return utils.WriteStructTo(g.filename, g.JsonGame)
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
	savesDir, err := utils.GetSavesDir()
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
