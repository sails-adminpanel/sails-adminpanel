"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('NodeTable', () => {
    it('should return correct output', async () => {
        // // Mock request object
        // const request = {
        //   start: '0',
        //   length: '10',
        //   order: [{ column: '0', dir: 'asc' }],
        //   columns: [{ data: 'id', searchable: 'true', orderable: 'true' }],
        //   search: { value: '' },
        //   draw: '1'
        // };
        // // Mock Waterline model
        // const mockModel = {
        //   count: async () => 100,
        //   find: async () => [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
        // };
        // // Create instance of NodeTable
        // const nodeTable = new NodeTable(request, mockModel);
        // // Execute the output method
        // await nodeTable.output((err: Error, output: any) => {
        //   // Log error message if not null
        //   if (err) {
        //     console.error(err.message);
        //   }
        //   // Log expected and actual output
        //   console.log('Expected Output:', {
        //     draw: '1',
        //     recordsTotal: 100,
        //     recordsFiltered: 100,
        //     data: [
        //       { id: 1, name: 'John' },
        //       { id: 2, name: 'Jane' }
        //     ]
        //   });
        //   console.log('Actual Output:', output);
        //   // Check if there is no error
        //   expect(err).to.be.null;
        //   // Check if output is not null
        //   expect(output).to.not.be.null;
        //   // Check if output is correct
        //   expect(output).to.deep.equal({
        //     draw: '1',
        //     recordsTotal: 100,
        //     recordsFiltered: 100,
        //     data: [
        //       { id: 1, name: 'John' },
        //       { id: 2, name: 'Jane' }
        //     ]
        //   });
        // });
    });
});
