package backend

import "context"

type StartAble interface {
	Startup(ctx context.Context)
}

func StartApps(starAbles []StartAble) func(ctx context.Context) {
	return func(ctx context.Context) {
		for _, app := range starAbles {
			app.Startup(ctx)
		}
	}
}
