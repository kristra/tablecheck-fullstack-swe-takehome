const stringifyDate = <
  T extends { checkInAt: Date; createdAt: Date; updatedAt: Date }
>(
  data: T[] | T
) => {
  if (Array.isArray(data)) {
    const result = data.map((d) => ({
      ...d,
      checkInAt: d.createdAt.toISOString(),
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));

    return result;
  } else {
    return {
      ...data,
      checkInAt: data.createdAt.toISOString(),
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }
};

export default stringifyDate;
