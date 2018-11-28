import {
  createLocation,
  LocationDescriptor,
  LocationDescriptorObject,
  locationsAreEqual,
} from "history";
import React, { useEffect } from "react";
import { generatePath, IMatch, usePrevious } from "./utils";
import { IRouterContext, useRouterContext } from "./RouterContext";

export interface IRedirectProps {
  to: LocationDescriptor;
  push?: boolean;
  from?: string;

  // from switch
  computedMatch?: IMatch<any>;
}

export const Redirect = (props: IRedirectProps) => {
  const context = useRouterContext();
  const prevToRef = usePrevious(props.to);

  useEffect(() => {
    if (
      prevToRef == null ||
      !locationsAreEqual(createLocation(prevToRef), createLocation(props.to))
    ) {
      perform(props, context);
    }
  });

  return null;
};

function perform(props: IRedirectProps, { history }: IRouterContext) {
  const { push = false } = props;
  const to = computeTo(props);
  (push ? history.push : history.replace)(to);
}

function computeTo({ computedMatch, to }: IRedirectProps) {
  if (computedMatch) {
    if (typeof to === "string") {
      return generatePath(to, computedMatch.params);
    }
    return {
      ...to,
      pathname: generatePath(
        (to as LocationDescriptorObject).pathname,
        computedMatch.params,
      ),
    };
  }
  return to;
}