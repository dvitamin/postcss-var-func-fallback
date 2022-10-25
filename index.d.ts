import {PluginCreator} from "postcss";

export interface Options {
  variables?: Record<string, string>
  treatErrorsAsWarnings?: boolean;
}

declare const value: PluginCreator<Options>;
export default value;
