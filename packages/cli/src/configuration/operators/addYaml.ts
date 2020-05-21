import yaml from 'yaml'
import { addParser } from './addParser'

const parse = (x: string) => yaml.parse(x)
const extension = ['yaml', 'yml']

export const addYaml = () => addParser({ parse, extension })
