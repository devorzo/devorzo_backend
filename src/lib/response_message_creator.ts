/* eslint-disable @typescript-eslint/no-explicit-any */
export const responseMessageCreator = (message: any = 'message', success: boolean | number = true):
{
  success: boolean;
  message: any;
} | {
  success: boolean;
  error: {
      message: any;
  };
} => {
  let data;

  if (success == true || success == 1) {
    data = {
      success: true,
      message,
    };
  } else {
    data = {
      success: false,
      error: { message },
    };
  }

  return data;
};

export default { responseMessageCreator };
