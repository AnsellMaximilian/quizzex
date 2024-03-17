export type ResponseObject<T> = {
  statusCode: number;
  data?: T;
  statusString: "OK" | "ERROR";
  message: string;
};

export type Choice = "A" | "B" | "C" | "D";
