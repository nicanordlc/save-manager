.PHONY: hi
hi:
	@echo zup

.PHONY: test-backend
test-backend:
	@go test -v ./backend/...

.PHONY: test-backend-cover
test-backend-cover:
	@go test -cover ./backend/...

.PHONY: test-backend-cover-open
test-backend-cover-open:
	@go test -coverprofile=coverage.out ./backend/...
	@go tool cover -html=coverage.out

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

.PHONY: release
release_version := v-$(shell git rev-parse --short HEAD)
owner := cabaalexander
repo := save-manager
release:
	@curl -L \
		-X POST \
		-H "Accept: application/vnd.github+json" \
		-H "Authorization: Bearer ${GIT_REPO_TOKEN}" \
		-H "X-GitHub-Api-Version: 2022-11-28" \
		https://api.github.com/repos/$(owner)/$(repo)/releases \
		-d '{"tag_name":"$(release_version)","target_commitish":"main","name":"$(release_version)","draft":false,"prerelease":false,"generate_release_notes":true}'
