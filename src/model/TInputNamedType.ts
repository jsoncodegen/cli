import { InputEnum } from './InputEnum.js'
import { InputInterface } from './InputInterface.js'
import { InputMixin } from './InputMixin.js'

export type TInputNamedType = (InputInterface | InputEnum | InputMixin) & {
	[key: string]: any
}
