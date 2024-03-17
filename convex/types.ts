export type ResponseObject<T> = {
  statusCode: number;
  data?: T;
  statusString: "OK" | "ERROR";
  message: string;
};
