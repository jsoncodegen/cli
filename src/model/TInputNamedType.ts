import { InputEnum } from './InputEnum'
import { InputInterface } from './InputInterface'
import { InputMixin } from './InputMixin'

export type TInputNamedType = (InputInterface | InputEnum | InputMixin) & {
	[key: string]: any
}
