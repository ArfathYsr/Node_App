export const ROLE_MESSAGES = {
  PATH_ROLE_CATEGORY_CRITERIA_ALIGNMENT: `/api/v1/role/role_category_criteria_alignment/{id}`,
  TAGS: `ROLE`,
  CONTENT: `application/json`,
  ROLE_CATEGORY_CRITERIA_EDITED: `Role Category & Criteria successfully edited`,
  EDIT_EXISTING_ROLE_CATEGORY_CRITERIA: `Edit an existing role category and criteria.`,
  NAME_VALIDATION:
    'Name must start with a letter or a number and contain only letters, numbers, spaces, and dashes',
    INVALID_ROLE_IDS: (roleId: number | undefined) =>
      `Invalid Role or Role with ID ${roleId} does not exist.`,
};
