import * as util from '../../../util';
import FieldContainer from '../FieldContainer';
import { computeCondition } from './conditions';


export function acceptCondition (fields, data, condition) {
    if(!condition)
        return true;

    return computeCondition(fields,data,condition);
}

const getValue = (form, field, value, locale) => {

    if(form.localized && field.localized) {
        //console.log(form, field, value, locale);
        return value[locale];
    }

    return value;
};

const getIdentifier = (identifier, field, locale) => {
    if(field.localized)
        return `${identifier}.${locale}`;
    return identifier;
};


export default {
    name: 'SharpFieldDisplay',
    functional: true,

    inject:['$form'],



    render(h, { props, injections }) {
        let { fieldKey,
            contextFields,
            contextData,
            errorIdentifier,
            updateVisibility,
            ...sharedProps } = props;

        let { $form } = injections;

        let field = contextFields[fieldKey];
        let value = contextData[fieldKey];

        if(!(fieldKey in contextFields)) {
            util.error(`Field display ('layout') : Can't find a field with key '${fieldKey}' in 'fields'`,contextFields);
            return null;
        }

        let isVisible = acceptCondition(contextFields, contextData, field.conditionalDisplay);

        updateVisibility && updateVisibility(fieldKey, isVisible);

        return isVisible ? h(FieldContainer, {
            props: {
                fieldKey,
                fieldProps: field,
                fieldType: field.type,
                value: getValue($form, field, value, props.locale),
                label: field.label,
                helpMessage: field.helpMessage,
                errorIdentifier: getIdentifier(errorIdentifier, field, props.locale),
                ...sharedProps
            }
        }) : null

    }
}
