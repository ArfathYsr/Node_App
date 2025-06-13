import AUTH_MODULE from './authTypes';
import CLIENT_MODULE from './clientTypes';
import LIBS from './libsTypes';
import INFO_MODULE from './infoTypes';
import PERMISSION_GROUP_MODULE from './permissionGroupTypes';
import PERMISSION_MODULE from './permissionTypes';
import PROFILE_MODULE from './profileTypes';
import FUNCTIONAL_AREA_MODULE from './functionalAreaTypes';
import ROLE_MODULE from './roleTypes';
import TOPIC_MODULE from './topicTypes';
import PRODUCT_MODULE from './productTypes';
import THERAPEUTIC_MODULE from './therapeuticAreaTypes';
import COMMON_MODULE from './commonTypes';
import LOOKUP_DATA_MODULE from './lookupdataTypes';
import VENDOR_MODULE from './vendorTypes';
import VENDOR_VENUE_CHECKLIST_MODULE from './vendorVenueChecklist';
import VENDOR_ROOM from './vendorRoomType';
import SERVICE_OFFERING_MODULE from './serviceOfferingType';
import SERVICE_TYPE_MODULE from './serviceType';
import ORG_HIERARCHY_MODULE from './orgHierarchyTypes';

const TYPES = {
  ...AUTH_MODULE,
  ...CLIENT_MODULE,
  ...FUNCTIONAL_AREA_MODULE,
  ...LIBS,
  ...INFO_MODULE,
  ...PERMISSION_GROUP_MODULE,
  ...PERMISSION_MODULE,
  ...PROFILE_MODULE,
  ...FUNCTIONAL_AREA_MODULE,
  ...ROLE_MODULE,
  ...TOPIC_MODULE,
  ...PRODUCT_MODULE,
  ...THERAPEUTIC_MODULE,
  ...COMMON_MODULE,
  ...VENDOR_ROOM,
  ...LOOKUP_DATA_MODULE,
  ...VENDOR_MODULE,
  ...VENDOR_VENUE_CHECKLIST_MODULE,
  ...SERVICE_OFFERING_MODULE,
  ...SERVICE_TYPE_MODULE,
  ...ORG_HIERARCHY_MODULE
};

export default TYPES;
