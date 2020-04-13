import { addParser } from './addParser'
import yaml from 'yaml'

const parse = (x: string) => yaml.parse(x)
const extension = ['yaml', 'yml']

export const addYaml = () => addParser({ parse, extension })