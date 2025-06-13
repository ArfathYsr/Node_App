export const ORG_HIERARCHY_MESSAGES = { 
    CLIENT_ORG_HIERARCHY_LIST_SUMMARY: 'List of Organization Hierarchy ',
    CLIENT_ORG_HIERARCHY_LIST_SUCCESSFULLY: 'List of Organization Hierarchy Successfully Retrieved',
    SORTING_ORG_DESC:  `
        **Sorting Fields**:
        - name: Sort by the org hierarchy name.
        - clientName: Sort by the client name.
        - statusName: Sort by the status.
        - fieldReleaseDate: Sort by the org hierarchy release date.
        - endDate: Sort by the org hierarchy end date.
        - effectiveDate: Sort by the org hierarchy effective date.
        - numberOfLevels: Sort by the org hierarchy number of levels.
        **Usage Example**:
        The sortBy field in the request body allows you to specify both the field and the order for sorting:
        - asc for ascending order
        - desc for descending order`,
    CLIENT_ORG_HIERARCHY_CLONED_SUCCESSFULLY: 'Client Org Hierarchy Cloned Sucessfully',

}
export const CLIENT_ORG_HIERARCHY_MESSAGES = {
    // ZOD Schema validation messages
    NAME_REQUIRED: 'Hierarchy Name is required.',
    NAME_NOT_EMPTY: 'Hierarchy Name is required.',
    DESCRIPTION_VALIDATION: 'Description must be a string',
    DESCRIPTION_NOT_EMPTY: 'Description cannot be empty',
    NO_OF_LEVELS_VALIDATION: 'No of Levels Must be a number',
    NO_OF_LEVELS_NOT_EMPTY: 'No of Levels cannot be empty',
    NO_OF_LEVELS_POSITIVE: 'Must be greater than 0',
    STATUS_VALIDATION: 'No of Levels Must be a number',
    STATUS_NOT_EMPTY: 'No of Levels cannot be empty',
    STATUS_POSITIVE: 'Must be greater than 0',
    EFFECTIVE_END_DATE_VALIDATION: 'Effective Date must be earlier than the End Date.',
    FIELD_RELEASE_END_DATE_VALIDATION: 'Field Release Date cannot be later than the End Date.',
    EFFECTIVE_FIELD_RELEASE_DATE_VALIDATION: 'Field Release Date should be equal or greater than the Effective Date.',
    DUPLICATE_HIERARCHY: (name: string) =>  `Hierarchy Name ${name} already exists. Please choose a unique name.`,

    // Normal Messages
    CLIENT_ORG_HIERARCHY_CREATED_SUCCESSFULLY: 'Client Org Hierarchy Created Sucessfully',
    CLIENT_ORG_HIERARCHY_SUMMARY: 'Create a new Client Org Hierarchy',
    CLIENT_ORG_HIERARCHY_LIST_SUMMARY: 'List of Client Org Hierarchy ',
    CLIENT_ORG_HIERARCHY_LIST_SUCCESSFULLY: 'List of Client Org Hierarchy ',
    CLIENT_ORG_HIERARCHY_CLONED_SUCCESSFULLY: 'Client Org Hierarchy Cloned Sucessfully',


}
export const CLIENT_ORG_LEVEL_MESSAGES = {
    // ZOD Schema validation messages
    NAME_REQUIRED: 'Name is required.',
    ALLOW_MULTIPLE: 'AllowMultipleLevelValue must be a boolean value',
    ISACTIVE_VALIDATION: 'IsActive must be a boolean value',
    LEVEL_ORDER: 'LevelOrder must be a positive integer',
    NO_OF_LEVELS_VALIDATION: 'No of Levels Must be a number',
    ATLEAST_ONE: 'At least one hierarchy level must be provided',
}