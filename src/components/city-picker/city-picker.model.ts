/**
 * Created by hsuanlee on 2017/2/7.
 */

export interface CityPickerColumn {
  name?:string,
  code?:string,
  children?:Array<CityPickerColumn>
}
