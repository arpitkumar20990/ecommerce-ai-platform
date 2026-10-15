import {randomBytes, createHash} from 'node:crypto'

const token = randomBytes(32).toString("hex")