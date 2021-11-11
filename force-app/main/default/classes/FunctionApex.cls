public with sharing class FunctionApex {
    public static void test() {
        System.debug('Invoking myfunction');

        functions.Function myFunction = functions.Function.get('function-recipes.01_Intro_ProcessLargeData_JS');
        functions.FunctionInvocation invocation = myFunction.invoke( '{"latitude": "36.169090", "longitude": "-115.140579","length": 5}');

        String jsonResponse = invocation.getResponse();

        System.debug('Response from myfunction ' + jsonResponse);
    }
}