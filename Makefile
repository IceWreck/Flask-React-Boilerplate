
start-dev:
	yarn webpack --mode development --watch & ./venv/bin/python3 app.py

prod-build:
	yarn webpack --mode production