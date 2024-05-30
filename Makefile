.PHONY: hi
hi:
	@echo zup

.PHONY: test-backend
test-backend:
	@go test -v ./backend

.PHONY: test-frontend-watch
test-frontend-watch:
	@cd frontend && yarn test

.PHONY: test-frontend
test-frontend:
	@cd frontend && yarn test --run

.PHONY: test
test: test-backend test-frontend

.PHONY: build-windows
build-windows:
	@wails build -platform windows/amd64

release_version := $(shell git rev-parse --short HEAD)
.PHONY: release
release:
	@git tag -a v-"$(release_version)" -m "$(release_version)"
	@git push --tags
