function getStateName(num) {
    num = parseInt(num, 10);

    switch (num) {
        case 1:
            return "Alabama";
        case 2:
            return "Alaska";
        case 3:
            return "";
        case 4:
            return "Arizona";
        case 5:
            return "Arkansas";
        case 6:
            return "California";
        case 7:
            return "";
        case 8:
            return "Colorado";
        case 9:
            return "Connecticut";
        case 10:
            return "Delaware";
        case 11:
            return "the District of Columbia";
        case 12:
            return "Florida";
        case 13:
            return "Georgia";
        case 14:
            return "";
        case 15:
            return "Hawaii";
        case 16:
            return "Idaho";
        case 17:
            return "Illinois";
        case 18:
            return "Indiana";
        case 19:
            return "Iowa";
        case 20:
            return "Kansas";
        case 21:
            return "Kentucky";
        case 22:
            return "Louisiana";
        case 23:
            return "Maine";
        case 24:
            return "Maryland";
        case 25:
            return "Massachusetts";
        case 26:
            return "Michigan";
        case 27:
            return "Minnesota";
        case 28:
            return "Mississippi";
        case 29:
            return "Missouri";
        case 30:
            return "Montana";
        case 31:
            return "Nebraska";
        case 32:
            return "Nevada";
        case 33:
            return "New Hampshire";
        case 34:
            return "New Jersey";
        case 35:
            return "New Mexico";
        case 36:
            return "New York";
        case 37:
            return "North Carolina";
        case 38:
            return "North Dakota";
        case 39:
            return "Ohio";
        case 40:
            return "Oklahoma";
        case 41:
            return "Oregon";
        case 42:
            return "Pennsylvania";
        case 43:
            return "";
        case 44:
            return "Rhode Island";
        case 45:
            return "South Carolina";
        case 46:
            return "South Dakota";
        case 47:
            return "Tennessee";
        case 48:
            return "Texas";
        case 49:
            return "Utah";
        case 50:
            return "Vermont";
        case 51:
            return "Virginia";
        case 52:
            return "";
        case 53:
            return "Washington";
        case 54:
            return "West Virginia";
        case 55:
            return "Wisconsin";
        case 56:
            return "Wyoming";
        default:
            return "Unknown";
    }
}

function getStateAbbr(num) {
    num = parseInt(num, 10);

    switch (num) {
        case 1:
            return "AL";
        case 2:
            return "AK";
        case 3:
            return "";
        case 4:
            return "AZ";
        case 5:
            return "AR";
        case 6:
            return "CA";
        case 7:
            return "";
        case 8:
            return "CO";
        case 9:
            return "CT";
        case 10:
            return "DE";
        case 11:
            return "DC";
        case 12:
            return "FL";
        case 13:
            return "GA";
        case 14:
            return "";
        case 15:
            return "HI";
        case 16:
            return "ID";
        case 17:
            return "IL";
        case 18:
            return "IN";
        case 19:
            return "IA";
        case 20:
            return "KS";
        case 21:
            return "KY";
        case 22:
            return "LA";
        case 23:
            return "ME";
        case 24:
            return "MD";
        case 25:
            return "MA";
        case 26:
            return "MI";
        case 27:
            return "MN";
        case 28:
            return "MS";
        case 29:
            return "MO";
        case 30:
            return "MT";
        case 31:
            return "NE";
        case 32:
            return "NV";
        case 33:
            return "NH";
        case 34:
            return "NJ";
        case 35:
            return "NM";
        case 36:
            return "NY";
        case 37:
            return "NC";
        case 38:
            return "ND";
        case 39:
            return "OH";
        case 40:
            return "OK";
        case 41:
            return "OR";
        case 42:
            return "PA";
        case 43:
            return "";
        case 44:
            return "RI";
        case 45:
            return "SC";
        case 46:
            return "SD";
        case 47:
            return "TN";
        case 48:
            return "TX";
        case 49:
            return "UT";
        case 50:
            return "VT";
        case 51:
            return "VA";
        case 52:
            return "";
        case 53:
            return "WA";
        case 54:
            return "WV";
        case 55:
            return "WI";
        case 56:
            return "WY";
        default:
            return "??";
    }
}

function getLabel(county) {
    return county.name.substring(0, county.name.length - 4) + ", " + getStateAbbr(county.state);
}