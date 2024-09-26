import { ContainerBuilder } from 'node-dependency-injection'
import { ConfigService } from '@/core/configService'

const container = new ContainerBuilder()

container.register('config.service', ConfigService)

export default container
