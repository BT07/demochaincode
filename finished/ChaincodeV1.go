package main

import(
"errors"
"fmt"
"github.com/hyperledger/fabric/core/chaincode/shim"
"encoding/json"

) 

const (
	UserPrefix	= "USER_"
	
)

 type Patient struct {
                Username  string  `json:"Username"`
                Name      string  `json:"Name"`
                DescriptionOfCurrentAilment  string  `json:"DescriptionOfCurrentAilment"`
                Allergies string  `json:"Allergies"`
 
            }
 
type SimpleChaincode struct {
}


func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

//INIT
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface,function string, args []string) ([]byte, error) {
	key := UserPrefix + args[0]
        
	if len(args) != 2 {
		return nil, errors.New("Incorrect number of arguments. Expecting 2")
	}

	err := stub.PutState(key, []byte(args[1]))
	if err != nil {
		fmt.Errorf(err.Error())
		return nil,err
	}
	fmt.Printf("store user:%s sucessfully", key)
	return nil,nil
}

//WRITE

func (t *SimpleChaincode) write(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
                var err error
           
                fmt.Println("running write()")
 
                if len(args) != 4{
                                return nil, errors.New("Incorrect number of arguments. Expecting 4. name of the key and value to set")
                }
 
                m_patient := &Patient{}
                m_patient.Username = args[0]
                m_patient.Name = args[1]
                m_patient.DescriptionOfCurrentAilment= args[2]
                 m_patient.Allergies=args[3]
 
                var key = args[0]
 
                value, err := json.Marshal(&m_patient)
 
                if err != nil {
                                return nil, err
                }
 
                err = stub.PutState(key, []byte(value)) //write the variable into the chaincode state
                if err != nil {
                                return nil, err
                }
                return nil, nil
}

//INVOKE
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "init" {
		return t.Init(stub,"init", args)
	} else if function == "write" {
		return t.write(stub, args)
	}
	fmt.Println("invoke did not find func: " + function)

	return nil, errors.New("Received unknown function invocation: " + function)
}

func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface, function string, args []string) ([]byte, error) {
	fmt.Println("query is running " + function)

	// Handle different functions
	if function == "read" { //read a variable
		return t.read(stub, args)
	}
	fmt.Println("query did not find func: " + function)

	return nil, errors.New("Received unknown function query: " + function)
}
func (t *SimpleChaincode) read(stub shim.ChaincodeStubInterface, args []string) ([]byte, error) {
	var key, jsonResp string
	var err error

	if len(args) != 1 {
		return nil, errors.New("Incorrect number of arguments. Expecting name of the key to query")
	}

	key = args[0]
	valAsbytes, err := stub.GetState(key)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + key + "\"}"
		return nil, errors.New(jsonResp)
	}

	return valAsbytes, nil
}
