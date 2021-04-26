const { spawn } = require('child_process')

function startDoc() {
	spawn('dumi', ['dev', './'], { stdio: 'inherit', cwd: `${process.cwd()}/docs` })
}

startDoc()
