import { config } from 'dotenv'
import { main as worker } from './worker/dev-runner-main'
import { main as graphql } from './graphql/dev-runner-main'

config()

void worker()
void graphql()
