#!/usr/bin/env node

import { glob } from 'glob'
import { mkdirp } from 'mkdirp'
import * as path from 'path'
import { rimraf } from 'rimraf'
import { pathToFileURL } from 'url'
import yargs from 'yargs'
import { generatorResultToMap } from './fun/generatorResultToMap.js'
import { getGenerator } from './fun/getGenerator.js'
import { parse } from './fun/parse.js'
import { readFiles } from './fun/readFiles.js'
import { writeOutput } from './fun/writeOutput.js'

const argv = yargs(process.argv)
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
	.parseSync()

main()

async function main() {
	try {
		const inputDir = path.resolve(argv.inputDir)
		const outputDir = path.resolve(argv.outputDir)
		await rimraf(outputDir)
		await mkdirp(outputDir)
		const generator = await getGenerator(argv.generator)
		const config = argv.config
			? (
					await import(
						pathToFileURL(
							path.resolve(
								process.cwd(),
								argv.config.endsWith('.js') ? argv.config : argv.config + '.js',
							),
						).toString()
					)
			  ).default
			: {}
		const inputFiles = (
			await glob('**/*.json', {
				cwd: inputDir,
			})
		).map((it) => it.replaceAll('\\', '/'))
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
