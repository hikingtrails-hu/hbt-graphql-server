import { config } from 'dotenv'

import { main as worker } from './worker/dev-runner-main'
import { main as graphql } from './graphql/dev-runner-main'
// import { xx } from './x'

config()
// void xx()

void worker()
void graphql()
