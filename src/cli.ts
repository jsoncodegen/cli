#!/usr/bin/env node

import * as _glob from 'glob'
import * as _mkdirp from 'mkdirp'
import * as path from 'path'
import * as _rimraf from 'rimraf'
import * as util from 'util'
import * as yargs from 'yargs'
import { generatorResultToMap } from './fun/generatorResultToMap'
import { getGenerator } from './fun/getGenerator'
import { parse } from './fun/parse'
import { readFiles } from './fun/readFiles'
import { writeOutput } from './fun/writeOutput'

const glob = util.promisify(_glob)
const rimraf = util.promisify(_rimraf)
const mkdirp = util.promisify(_mkdirp)
const { argv } = yargs
	.option('generator', {
		alias: ['g'],
		type: 'string',
		description: 'The generator to use.',
		demandOption: true,
	})
	.option('outputDir', {
		alias: 'o',
		type: 'string',
		description: 'The directory to put the output into.',
		demandOption: true,
	})
	.option('inputDir', {
		alias: 'i',
		type: 'string',
		description: 'The directory to read JSON definitions from.',
		demandOption: true,
	})
	.option('config', {
		alias: 'c',
		type: 'string',
		description: 'Path to a JS config module for the generator.',
	})

main()

async function main() {
	try {
		const inputDir = path.resolve(argv.inputDir)
		const outputDir = path.resolve(argv.outputDir)
		await rimraf(outputDir)
		await mkdirp(outputDir)
		const generator = getGenerator(argv.generator)
		const config = argv.config
			? require(path.resolve(process.cwd(), argv.config))
			: {}
		const inputFiles = await glob('**/*.json', {
			cwd: inputDir,
		})
		const json = await readFiles(inputDir, inputFiles)
		const namedTypesById = parse(json)
		const generatorResult = await generator.generate(config, namedTypesById)
		const out = generatorResultToMap(generatorResult)
		await writeOutput(outputDir, out)
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}
