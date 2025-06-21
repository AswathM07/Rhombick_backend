import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import axios from "axios";

interface CustomerType {
  _id: string;
  customerId: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  gstNumber: string;
}

interface InvoiceType {
  _id: string;
  invoiceNo: string;
  poNo: string;
  poDate: string;
  dcNo: string;
  dcDate: string;
  invoiceDate: string;
  customer: CustomerType;
}

const Invoice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [InvoiceList, setInvoiceList] = useState<InvoiceType[]>([]);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const cancelRef = useRef(null);

  const history = useHistory();
  const toast = useToast();

  const fetchInvoice = async () => {
    try {
      setIsLoading(true);
      const response = await axios(`api/invoices`);

      console.log(response.data);
      setInvoiceList(response?.data?.data);
    } catch (error) {
      toast({
        title: "Failed to fetch invoice details",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      console.error("API fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`api/invoices/${id}`);
      toast({
        title: "Invoice deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      fetchInvoice();
    } catch (error) {
      const errorMsg = error?.response?.data?.error?.[0];
      toast({
        title: "Failed to delete invoice",
        description: errorMsg ?? "",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      console.error("Delete error:", error);
    } finally {
      setIsDeleteAlertOpen(false);
    }
  };
  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold" m="auto 0">
          Invoice List
        </Text>
        <Button
          variant="solid"
          size={"sm"}
          bg="black"
          color="white"
          _hover={{ bg: "gray.800" }}
          leftIcon={<AddIcon />}
          onClick={() => history.push("/invoice/new-invoice")}
        >
          New
        </Button>
      </Flex>
      <Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Invoice Number</Th>
                <Th>Invoice Date</Th>
                <Th>PO Number</Th>
                <Th>PO Date</Th>
                <Th>DC Number</Th>
                <Th>DC Date</Th>
                <Th>Customer Name</Th>
                <Th>Phone Number</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={9} rowSpan={5} textAlign="center">
                    <Spinner size="lg" />
                  </Td>
                </Tr>
              ) : InvoiceList.length === 0 ? (
                <Tr>
                  <Td colSpan={9} rowSpan={5} textAlign="center">
                    No Data Found
                  </Td>
                </Tr>
              ) : (
                InvoiceList?.map((item, i) => {
                  return (
                    <Tr key={i}>
                      <Td>{item.invoiceNo}</Td>
                      <Td>{item.invoiceDate?.split("T")[0]}</Td>
                      <Td>{item.poNo}</Td>
                      <Td>{item.poDate?.split("T")[0]}</Td>
                      <Td>{item.dcNo}</Td>
                      <Td>{item?.dcDate?.split("T")[0]}</Td>
                      <Td>{item?.customer?.customerName ?? "-"}</Td>
                      <Td>{item?.customer?.phoneNumber ?? "-"}</Td>
                      <Td>
                        <Flex gap={2}>
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            variant="ghost"
                            onClick={() => history.push(`/invoice/new-invoice`)}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon />}
                            variant="ghost"
                            onClick={() => {
                              setDeleteId(item._id);
                              setIsDeleteAlertOpen(true);
                            }}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <AlertDialog
          isOpen={isDeleteAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Invoice
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this invoice? This action cannot
                be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsDeleteAlertOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => deleteId && handleDelete(deleteId)}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
};

export default Invoice;
